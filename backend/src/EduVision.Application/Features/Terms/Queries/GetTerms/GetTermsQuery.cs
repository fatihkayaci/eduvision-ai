using MediatR;

namespace EduVision.Application.Features.Terms.Queries.GetTerms;

public sealed record GetTermsQuery(Guid SchoolId) : IRequest<List<GetTermsResponse>>;
