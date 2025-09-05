namespace TasinmazProje.Presentation.Dtos
{
    public class PropertyCreateDto
    {
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
    }
}