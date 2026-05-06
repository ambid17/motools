using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Motool_api.Data;
using Motool_api.Models;

namespace Motool_api.Services;

public class DatabaseSeeder(IServiceProvider serviceProvider, ILogger<DatabaseSeeder> logger) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        await db.Database.EnsureCreatedAsync(cancellationToken);

        if (await db.MotorcycleMakes.AnyAsync(cancellationToken))
            return;

        logger.LogInformation("Seeding motorcycle makes from NHTSA API...");

        try
        {
            using var http = new HttpClient();
            var response = await http.GetStringAsync(
                "https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/motorcycle?format=json",
                cancellationToken);

            using var doc = JsonDocument.Parse(response);
            var results = doc.RootElement.GetProperty("Results");

            var makes = new List<MotorcycleMake>();
            foreach (var item in results.EnumerateArray())
            {
                var name = item.GetProperty("MakeName").GetString();
                if (!string.IsNullOrWhiteSpace(name))
                    makes.Add(new MotorcycleMake { Name = name });
            }

            db.MotorcycleMakes.AddRange(makes);
            await db.SaveChangesAsync(cancellationToken);
            logger.LogInformation("Seeded {Count} motorcycle makes.", makes.Count);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to seed motorcycle makes.");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
