using Microsoft.AspNetCore.Mvc;
using TasinmazProje.Business.Interfaces;
using TasinmazProje.Presentation.Dtos;
using System.Linq;

namespace TasinmazProje.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DistrictController : ControllerBase
    {
        private readonly IDistrictService _districtService;

        public DistrictController(IDistrictService districtService)
        {
            _districtService = districtService;
        }

        [HttpGet]
        public IActionResult GetAll([FromQuery] int? cityId)
        {
            var districts = _districtService.GetAll();

            if (cityId.HasValue)
            {
                districts = districts.Where(d => d.CityId == cityId.Value).ToList();
            }

            var districtDtos = districts.Select(d => new DistrictDto
            {
                Id = d.Id,
                Name = d.Name,
                CityId = d.CityId
            }).ToList();

            return Ok(districtDtos);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var district = _districtService.GetById(id);
            if (district == null)
                return NotFound();

            var districtDto = new DistrictDto
            {
                Id = district.Id,
                Name = district.Name,
                CityId = district.CityId
            };

            return Ok(districtDto);
        }
    }
}