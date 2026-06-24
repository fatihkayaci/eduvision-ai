using EduVision.Application.Comman.Interfaces;
using MediatR;

namespace EduVision.Application.Features.Terms.Queries.GetTerms;

public sealed class GetTermsQueryHandler(ITermRepository termRepository)
    : IRequestHandler<GetTermsQuery, List<GetTermsResponse>>
{
    public async Task<List<GetTermsResponse>> Handle(GetTermsQuery request, CancellationToken cancellationToken)
    {
        var terms = await termRepository.GetBySchoolIdAsync(request.SchoolId, cancellationToken);

        return terms
            .Select(t => new GetTermsResponse(t.Id, t.Name, t.Year, t.StartDate, t.EndDate))
            .ToList();
    }
}
