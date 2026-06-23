using EduVision.Application.Features.Teacher.Queries.GetCourses;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EduVision.Api.Controllers;

[ApiController]
[Route("api/teacher")]
public sealed class TeacherController(ISender sender) : ControllerBase
{
    [HttpGet("{teacherId:guid}/courses")]
    public async Task<ActionResult<List<GetCoursesResponse>>> GetCourses(Guid teacherId, CancellationToken cancellationToken)
    {
        var response = await sender.Send(new GetCoursesQuery(teacherId), cancellationToken);
        return Ok(response);
    }
}
