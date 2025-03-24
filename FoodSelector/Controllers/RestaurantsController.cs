using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace FoodSelector.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RestaurantsController : ControllerBase
{
    private readonly string _filePath = Path.Combine("wwwroot", "data", "restaurants.json");

    [HttpGet]
    public IActionResult Load()
    {
        if (!System.IO.File.Exists(_filePath))
            return NotFound();

        var json = System.IO.File.ReadAllText(_filePath);
        return Content(json, "application/json");
    }

    [HttpPost]
    public async Task<IActionResult> Save([FromBody] JsonElement json)
    {
        await System.IO.File.WriteAllTextAsync(_filePath, json.ToString());
        return Ok();
    }
}