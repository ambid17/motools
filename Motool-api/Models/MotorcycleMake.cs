namespace Motool_api.Models;

public class MotorcycleMake
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public ICollection<MotorcycleModel> Models { get; set; } = [];
}
