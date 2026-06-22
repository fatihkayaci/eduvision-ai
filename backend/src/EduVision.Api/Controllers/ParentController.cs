using EduVision.Application.Features.Parent.Queries.GetStudents;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EduVision.Api.Controllers;

[ApiController]
[Route("api/parent")]
public sealed class ParentController(ISender sender) : ControllerBase
{
    [HttpGet("{parentId:guid}/students")]
    public async Task<ActionResult<List<GetStudentsResponse>>> GetStudents(Guid parentId, CancellationToken cancellationToken)
    {
        var response = await sender.Send(new GetStudentsQuery(parentId), cancellationToken);

        return Ok(response);
    }
}
