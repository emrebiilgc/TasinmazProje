using Microsoft.AspNetCore.Mvc;
using TasinmazProje.Business.Interfaces;
using TasinmazProje.Presentation.Dtos;

namespace TasinmazProje.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CityController : ControllerBase
    {
        private readonly ICityService _cityService;

        public CityController(ICityService cityService)
        {
            _cityService = cityService;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var cities = _cityService.GetAll();
            
            var cityDtos = cities.Select(c => new CityDto
            {
                Id = c.Id,
                Name = c.Name
            }).ToList();

            return Ok(cityDtos);
        }
    }
}