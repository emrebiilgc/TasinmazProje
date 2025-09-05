using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TasinmazProje.Business.Interfaces;
using TasinmazProje.Entities;

namespace TasinmazProje.Presentation.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class LogController : ControllerBase
    {
        private readonly ILogService _logService;

        public LogController(ILogService logService)
        {
            _logService = logService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var logs = await _logService.GetAllAsync();

            var result = logs.Select(l => new
            {
                l.Id,
                l.UserId,
                l.Operation,
                l.Detail,
                l.Timestamp,
                l.IpAddress,
                l.Status
            });

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> AddLog([FromBody] Log log)
        {
            if (log == null)
                return BadRequest("Geçersiz log verisi.");

            await _logService.LogAsync(log.UserId, log.Operation, log.Detail, log.Status);
            return Ok("Log kaydedildi.");
        }
    }
}