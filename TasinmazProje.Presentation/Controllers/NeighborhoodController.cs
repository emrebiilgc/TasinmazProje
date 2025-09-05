using Microsoft.AspNetCore.Mvc;
using TasinmazProje.Business.Interfaces;
using TasinmazProje.Presentation.Dtos;
using System.Linq;

namespace TasinmazProje.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NeighborhoodController : ControllerBase
    {
        private readonly INeighborhoodService _neighborhoodService;

        public NeighborhoodController(INeighborhoodService neighborhoodService)
        {
            _neighborhoodService = neighborhoodService;
        }

        [HttpGet]
        public IActionResult GetAll([FromQuery] int? districtId)
        {
            var neighborhoods = _neighborhoodService.GetAll();

            if (districtId.HasValue)
            {
                neighborhoods = neighborhoods.Where(n => n.DistrictId == districtId.Value).ToList();
            }

            var neighborhoodDtos = neighborhoods.Select(n => new NeighborhoodDto
            {
                Id = n.Id,
                Name = n.Name,
                DistrictId = n.DistrictId
            }).ToList();

            return Ok(neighborhoodDtos);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var neighborhood = _neighborhoodService.GetById(id);
            if (neighborhood == null)
                return NotFound();

            var neighborhoodDto = new NeighborhoodDto
            {
                Id = neighborhood.Id,
                Name = neighborhood.Name,
                DistrictId = neighborhood.DistrictId
            };

            return Ok(neighborhoodDto);
        }
    }
}