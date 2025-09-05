namespace TasinmazProje.Entities
{
    public class Log
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string Operation { get; set; } = null!;
        public string Detail { get; set; } = null!;
        public string IpAddress { get; set; } = "";
        public bool Status { get; set; } = true;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    }
}