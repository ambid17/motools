namespace Motool_api.Models;

public class MotorcycleModel
{
    public int Id { get; set; }
    public int MakeId { get; set; }
    public string Name { get; set; } = string.Empty;
    public MotorcycleMake Make { get; set; } = null!;
}
