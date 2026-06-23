using MediatR;

namespace EduVision.Application.Features.Student.Queries.GetStudentAttendances;

public sealed record GetStudentAttendancesQuery(Guid StudentId) : IRequest<GetStudentAttendancesResponse>;
