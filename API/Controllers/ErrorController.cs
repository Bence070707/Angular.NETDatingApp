using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ErrorController : ControllerBase
    {
        [HttpGet("auth")]
        public IActionResult GetAuthError()
        {
            return Unauthorized();
        }

        [HttpGet("notfound")]
        public IActionResult GetNotFoundError()
        {
            return NotFound();
        }

        [HttpGet("server")]
        public IActionResult GetServerError()
        {
            throw new Exception("This is a server error");
        }

        [HttpGet("badrequest")]
        public IActionResult GetBadRequestError()
        {
            return BadRequest("This was not a good request");
        }
    }
}
