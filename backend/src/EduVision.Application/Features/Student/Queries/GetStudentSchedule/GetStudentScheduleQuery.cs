using MediatR;

namespace EduVision.Application.Features.Student.Queries.GetStudentSchedule;

public sealed record GetStudentScheduleQuery(Guid StudentId) : IRequest<List<GetStudentScheduleResponse>>;
