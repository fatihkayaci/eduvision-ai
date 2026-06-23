using MediatR;

namespace EduVision.Application.Features.Student.Queries.GetStudentProfile;

public sealed record GetStudentProfileQuery(Guid StudentId) : IRequest<GetStudentProfileResponse?>;
