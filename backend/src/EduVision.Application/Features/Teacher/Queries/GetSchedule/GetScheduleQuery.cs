using MediatR;

namespace EduVision.Application.Features.Teacher.Queries.GetSchedule;

public sealed record GetScheduleQuery(Guid TeacherId, Guid TermId) : IRequest<List<GetScheduleResponse>>;
