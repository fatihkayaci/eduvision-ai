using MediatR;

namespace EduVision.Application.Features.Student.Queries.GetStudentRank;

public sealed record GetStudentRankQuery(Guid StudentId, Guid TermId) : IRequest<GetStudentRankResponse?>;
