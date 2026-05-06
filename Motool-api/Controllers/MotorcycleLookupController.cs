using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Motool_api.Data;

namespace Motool_api.Controllers;

[ApiController]
[Route("api/lookup")]
public class MotorcycleLookupController(ApplicationDbContext db) : ControllerBase
{
    [HttpGet("makes")]
    public async Task<IActionResult> GetMakes()
    {
        var makes = await db.MotorcycleMakes
            .OrderBy(m => m.Name)
            .Select(m => new { m.Id, m.Name })
            .ToListAsync();
        return Ok(makes);
    }

    [HttpGet("models")]
    public async Task<IActionResult> GetModels([FromQuery] int makeId)
    {
        var models = await db.MotorcycleModels
            .Where(m => m.MakeId == makeId)
            .OrderBy(m => m.Name)
            .Select(m => new { m.Id, m.Name })
            .ToListAsync();
        return Ok(models);
    }
}
