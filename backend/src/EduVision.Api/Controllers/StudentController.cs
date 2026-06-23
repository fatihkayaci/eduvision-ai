using EduVision.Application.Features.Student.Queries.GetStudentProfile;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EduVision.Api.Controllers;

[ApiController]
[Route("api/student")]
public sealed class StudentController(ISender sender) : ControllerBase
{
    [HttpGet("{studentId:guid}/profile")]
    public async Task<ActionResult<GetStudentProfileResponse>> GetProfile(Guid studentId, CancellationToken cancellationToken)
    {
        var response = await sender.Send(new GetStudentProfileQuery(studentId), cancellationToken);

        if (response is null)
            return NotFound();

        return Ok(response);
    }
}
