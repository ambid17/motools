namespace Motool_api.Models;

public class UserMotorcycle
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int Year { get; set; }
    public int MakeId { get; set; }
    public int ModelId { get; set; }
    public string TrimLevel { get; set; } = string.Empty;
    public string Modifications { get; set; } = string.Empty;
    public MotorcycleMake Make { get; set; } = null!;
    public MotorcycleModel Model { get; set; } = null!;
}
