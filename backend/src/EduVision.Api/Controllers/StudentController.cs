using EduVision.Application.Features.Student.Queries.GetStudentAssignments;
using EduVision.Application.Features.Student.Queries.GetStudentSchedule;
using EduVision.Application.Features.Student.Queries.GetStudentAttendances;
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
        return Ok(response);
    }

    [HttpGet("{studentId:guid}/courses")]
    public async Task<ActionResult<List<GetStudentCoursesResponse>>> GetCourses(Guid studentId, CancellationToken cancellationToken)
    {
        var response = await sender.Send(new GetStudentCoursesQuery(studentId), cancellationToken);
        return Ok(response);
    }

    [HttpGet("{studentId:guid}/schedule")]
    public async Task<ActionResult<List<GetStudentScheduleResponse>>> GetSchedule(Guid studentId, CancellationToken cancellationToken)
    {
        var response = await sender.Send(new GetStudentScheduleQuery(studentId), cancellationToken);
        return Ok(response);
    }

    [HttpGet("{studentId:guid}/assignments")]
    public async Task<ActionResult<List<GetStudentAssignmentsResponse>>> GetAssignments(Guid studentId, CancellationToken cancellationToken)
    {
        var response = await sender.Send(new GetStudentAssignmentsQuery(studentId), cancellationToken);
        return Ok(response);
    }

    [HttpGet("{studentId:guid}/attendances")]
    public async Task<ActionResult<GetStudentAttendancesResponse>> GetAttendances(Guid studentId, CancellationToken cancellationToken)
    {
        var response = await sender.Send(new GetStudentAttendancesQuery(studentId), cancellationToken);
        return Ok(response);
    }
}
