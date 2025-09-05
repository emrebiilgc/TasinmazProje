namespace TasinmazProje.Entities
{
    public class Property
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int Ada { get; set; }
        public int Parsel { get; set; }
        public string Nitelik { get; set; } = null!;
        public string Adres { get; set; } = null!;

        public double Latitude { get; set; } 
        public double Longitude { get; set; }

        public int CityId { get; set; }
        public int DistrictId { get; set; }
        public int NeighborhoodId { get; set; }

        public City? City { get; set; }
        public District? District { get; set; }
        public Neighborhood? Neighborhood { get; set; }
        public int? UserId { get; set; }
        public User? User { get; set; }
    }
}