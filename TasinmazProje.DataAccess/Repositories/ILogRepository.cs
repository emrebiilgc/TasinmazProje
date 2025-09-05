using TasinmazProje.Entities;

namespace TasinmazProje.DataAccess.Repositories
{
    public interface ILogRepository
    {
        Task AddAsync(Log log);
        Task<List<Log>> GetAllAsync();
    }
}