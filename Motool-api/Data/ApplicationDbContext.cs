using Microsoft.EntityFrameworkCore;
using Motool_api.Models;

namespace Motool_api.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<MotorcycleMake> MotorcycleMakes => Set<MotorcycleMake>();
    public DbSet<MotorcycleModel> MotorcycleModels => Set<MotorcycleModel>();
    public DbSet<UserMotorcycle> UserMotorcycles => Set<UserMotorcycle>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MotorcycleMake>(e =>
        {
            e.HasIndex(m => m.Name).IsUnique();
        });

        modelBuilder.Entity<MotorcycleModel>(e =>
        {
            e.HasOne(m => m.Make)
             .WithMany(mk => mk.Models)
             .HasForeignKey(m => m.MakeId)
             .OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(m => new { m.MakeId, m.Name }).IsUnique();
        });

        modelBuilder.Entity<UserMotorcycle>(e =>
        {
            e.HasOne(u => u.Make).WithMany().HasForeignKey(u => u.MakeId);
            e.HasOne(u => u.Model).WithMany().HasForeignKey(u => u.ModelId);
            e.HasIndex(u => u.UserId);
        });
    }
}
