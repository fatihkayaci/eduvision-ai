using EduVision.Application.Features.Student.Queries.GetStudentCourses;
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

    [HttpGet("{studentId:guid}/courses")]
    public async Task<ActionResult<List<GetStudentCoursesResponse>>> GetCourses(Guid studentId, CancellationToken cancellationToken)
    {
        var response = await sender.Send(new GetStudentCoursesQuery(studentId), cancellationToken);
        return Ok(response);
    }
}
