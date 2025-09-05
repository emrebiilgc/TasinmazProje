using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TasinmazProje.Business.Interfaces;
using TasinmazProje.Entities;
using TasinmazProje.Presentation.Dtos;

namespace TasinmazProje.Presentation.Controllers
{
    [ApiController]
[Route("api/[controller]")]
[Authorize]
public class PropertyController : ControllerBase
{
    private readonly IPropertyService _propertyService;
    private readonly ILogService _logService;

    public PropertyController(IPropertyService propertyService, ILogService logService)
    {
        _propertyService = propertyService;
        _logService = logService;
    }

    private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    private string GetUserRole() => User.FindFirst(ClaimTypes.Role)!.Value;

    [HttpGet]
    public async Task<IActionResult> GetFiltered([FromQuery] int? cityId, [FromQuery] int? districtId, [FromQuery] int? neighborhoodId)
    {
        var userId = GetUserId();
        var role = GetUserRole();

        var properties = await _propertyService.FilterAsync(cityId, districtId, neighborhoodId);

        if (role == "User")
            properties = properties.Where(p => p.UserId == userId).ToList();

        var dtoList = properties.Select(p => new PropertyDto
        {
            Id = p.Id,
            Title = p.Title,
            Description = p.Description,
            Ada = p.Ada,
            Parsel = p.Parsel,
            Nitelik = p.Nitelik,
            Adres = p.Adres,
            Latitude = p.Latitude,
            Longitude = p.Longitude,
            CityName = p.City?.Name ?? "",
            DistrictName = p.District?.Name ?? "",
            NeighborhoodName = p.Neighborhood?.Name ?? "",
            UserId = p.UserId
        }).ToList();

        return Ok(dtoList);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var property = await _propertyService.GetByIdAsync(id);
        if (property == null)
            return NotFound();

        var userId = GetUserId();
        var role = GetUserRole();

        if (role == "User" && property.UserId != userId)
            return Forbid();

        var dto = new PropertyDto
        {
            Id = property.Id,
            Title = property.Title,
            Description = property.Description,
            Ada = property.Ada,
            Parsel = property.Parsel,
            Nitelik = property.Nitelik,
            Adres = property.Adres,
            Latitude = property.Latitude,
            Longitude = property.Longitude,
            CityId = property.CityId,
            CityName = property.City?.Name ?? "",
            DistrictId = property.DistrictId,
            DistrictName = property.District?.Name ?? "",
            NeighborhoodId = property.NeighborhoodId,
            NeighborhoodName = property.Neighborhood?.Name ?? "",
            UserId = property.UserId
        };

        return Ok(dto);
    }

    [Authorize(Roles = "User,Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(PropertyCreateDto dto)
    {
        var userId = GetUserId();

        var property = new Property
        {
            Title = dto.Title,
            Description = dto.Description,
            Ada = dto.Ada,
            Parsel = dto.Parsel,
            Nitelik = dto.Nitelik,
            Adres = dto.Adres,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            CityId = dto.CityId,
            DistrictId = dto.DistrictId,
            NeighborhoodId = dto.NeighborhoodId,
            UserId = userId
        };

        await _propertyService.AddAsync(property);
        await _logService.LogAsync(userId, "Property Create", $"Yeni taşınmaz eklendi: {property.Title}");

        return Ok(new { message = "Taşınmaz başarıyla eklendi." });
    }

    [Authorize(Roles = "User,Admin")]
    [HttpPut]
    public async Task<IActionResult> Update(PropertyUpdateDto dto)
    {
        var existing = await _propertyService.GetByIdAsync(dto.Id);
        if (existing == null)
            return NotFound();

        var userId = GetUserId();
        var role = GetUserRole();

        if (role == "User" && existing.UserId != userId)
            return Forbid();

        existing.Title = dto.Title;
        existing.Description = dto.Description;
        existing.Ada = dto.Ada;
        existing.Parsel = dto.Parsel;
        existing.Nitelik = dto.Nitelik;
        existing.Adres = dto.Adres;
        existing.Latitude = dto.Latitude;
        existing.Longitude = dto.Longitude;
        existing.CityId = dto.CityId;
        existing.DistrictId = dto.DistrictId;
        existing.NeighborhoodId = dto.NeighborhoodId;

        await _propertyService.UpdateAsync(existing);
        await _logService.LogAsync(userId, "Property Update", $"Taşınmaz güncellendi: {existing.Title}");

        return Ok(new { message = "Taşınmaz başarıyla güncellendi." });
    }

    [Authorize(Roles = "User,Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var property = await _propertyService.GetByIdAsync(id);
        if (property == null)
            return NotFound();

        var userId = GetUserId();
        var role = GetUserRole();

        if (role == "User" && property.UserId != userId)
            return Forbid();

        await _propertyService.DeleteAsync(id);
        await _logService.LogAsync(userId, "Property Delete", $"Taşınmaz silindi: {property.Title}");

        return Ok(new { message = "Taşınmaz başarıyla silindi." });
    }
}

}
