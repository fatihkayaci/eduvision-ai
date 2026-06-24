namespace EduVision.Application.Features.Terms.Queries.GetTerms;

public sealed record GetTermsResponse(
    Guid Id,
    string Name,
    int Year,
    DateOnly StartDate,
    DateOnly EndDate);
