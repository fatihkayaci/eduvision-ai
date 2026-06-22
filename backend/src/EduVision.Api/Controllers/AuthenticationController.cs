using EduVision.Application.Features.Authentication.Commands.Login;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EduVision.Api.Controllers;

[ApiController]
[Route("api/authentication")]
public sealed class AuthenticationController(ISender sender) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginCommand command, CancellationToken cancellationToken)
    {
        var response = await sender.Send(command, cancellationToken);

        return Ok(response);
    }
}
