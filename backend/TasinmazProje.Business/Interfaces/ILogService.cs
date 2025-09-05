using TasinmazProje.Entities;

namespace TasinmazProje.Business.Interfaces
{
    public interface ILogService
    {
        Task LogAsync(int? userId, string operation, string detail, bool status = true);
        Task<List<Log>> GetAllAsync();
            
    }
}