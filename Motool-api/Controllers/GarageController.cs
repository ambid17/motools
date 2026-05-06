using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Motool_api.Data;
using Motool_api.Models;

namespace Motool_api.Controllers;

[ApiController]
[Route("api/garage")]
[Authorize]
public class GarageController(ApplicationDbContext db) : ControllerBase
{
    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub")
        ?? throw new UnauthorizedAccessException();

    [HttpGet]
    public async Task<IActionResult> GetGarage()
    {
        var motorcycles = await db.UserMotorcycles
            .Where(m => m.UserId == UserId)
            .Include(m => m.Make)
            .Include(m => m.Model)
            .OrderBy(m => m.Year)
            .Select(m => new
            {
                m.Id,
                m.Year,
                Make = m.Make.Name,
                m.MakeId,
                Model = m.Model.Name,
                m.ModelId,
                m.TrimLevel,
                m.Modifications
            })
            .ToListAsync();

        return Ok(motorcycles);
    }

    [HttpPost]
    public async Task<IActionResult> AddMotorcycle([FromBody] AddMotorcycleRequest request)
    {
        var motorcycle = new UserMotorcycle
        {
            UserId = UserId,
            Year = request.Year,
            MakeId = request.MakeId,
            ModelId = request.ModelId,
            TrimLevel = request.TrimLevel ?? string.Empty,
            Modifications = request.Modifications ?? string.Empty
        };

        db.UserMotorcycles.Add(motorcycle);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetGarage), new { id = motorcycle.Id }, motorcycle);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMotorcycle(int id, [FromBody] AddMotorcycleRequest request)
    {
        var motorcycle = await db.UserMotorcycles
            .FirstOrDefaultAsync(m => m.Id == id && m.UserId == UserId);

        if (motorcycle is null) return NotFound();

        motorcycle.Year = request.Year;
        motorcycle.MakeId = request.MakeId;
        motorcycle.ModelId = request.ModelId;
        motorcycle.TrimLevel = request.TrimLevel ?? string.Empty;
        motorcycle.Modifications = request.Modifications ?? string.Empty;

        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMotorcycle(int id)
    {
        var motorcycle = await db.UserMotorcycles
            .FirstOrDefaultAsync(m => m.Id == id && m.UserId == UserId);

        if (motorcycle is null) return NotFound();

        db.UserMotorcycles.Remove(motorcycle);
        await db.SaveChangesAsync();
        return NoContent();
    }
}

public record AddMotorcycleRequest(int Year, int MakeId, int ModelId, string? TrimLevel, string? Modifications);
