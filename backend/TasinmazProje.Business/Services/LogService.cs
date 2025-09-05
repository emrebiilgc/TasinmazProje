using Microsoft.AspNetCore.Http;
using TasinmazProje.Business.Interfaces;
using TasinmazProje.DataAccess.Repositories;
using TasinmazProje.Entities;

namespace TasinmazProje.Business.Services
{
    public class LogService : ILogService
    {
        private readonly ILogRepository _logRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LogService(ILogRepository logRepository, IHttpContextAccessor httpContextAccessor)
        {
            _logRepository = logRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task LogAsync(int? userId, string operation, string detail, bool status = true)
        {
            var ipAddress = _httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? "Bilinmiyor";

            var log = new Log
            {
                UserId = userId,
                Operation = operation,
                Detail = detail,
                Timestamp = DateTime.UtcNow,
                IpAddress = ipAddress,
                Status = status
            };

            await _logRepository.AddAsync(log);
        }

        public async Task<List<Log>> GetAllAsync()
        {
            return await _logRepository.GetAllAsync();
        }
    }
}