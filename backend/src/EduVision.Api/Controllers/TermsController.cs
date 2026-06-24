using EduVision.Application.Features.Terms.Queries.GetTerms;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EduVision.Api.Controllers;

[ApiController]
[Route("api/terms")]
public sealed class TermsController(ISender sender) : ControllerBase
{
    [HttpGet("{schoolId:guid}")]
    public async Task<ActionResult<List<GetTermsResponse>>> GetTerms(Guid schoolId, CancellationToken cancellationToken)
    {
        var response = await sender.Send(new GetTermsQuery(schoolId), cancellationToken);
        return Ok(response);
    }
}
