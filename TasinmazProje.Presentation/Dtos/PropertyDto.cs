namespace TasinmazProje.Presentation.Dtos
{
    public class PropertyDto
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
        public string CityName { get; set; } = null!;
        public int DistrictId { get; set; }     
        public string DistrictName { get; set; } = null!;
        public int NeighborhoodId { get; set; }  
        public string NeighborhoodName { get; set; } = null!;

        public int? UserId { get; set; }
    }
}