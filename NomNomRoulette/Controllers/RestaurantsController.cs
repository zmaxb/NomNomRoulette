using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using NomNomRoulette.Helpers;

namespace NomNomRoulette.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RestaurantsController : ControllerBase
{
    private readonly string _filePath = Path.Combine("wwwroot", "data", "restaurants.json");

    [HttpGet]
    public IActionResult Load()
    {
        if (!FileHelper.TryReadJson(_filePath, out var json))
            return StatusCode(500, "Failed to read settings file");

        return Content(json, "application/json");
    }

    [HttpPost]
    public IActionResult Save([FromBody] JsonElement json)
    {
        if (!FileHelper.TryWriteJson(_filePath, json))
            return StatusCode(500, "Failed to write settings file");

        return Ok();
    }
}