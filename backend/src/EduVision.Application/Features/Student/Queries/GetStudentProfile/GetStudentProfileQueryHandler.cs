using EduVision.Application.Comman.Interfaces;
using MediatR;

namespace EduVision.Application.Features.Student.Queries.GetStudentProfile;

public sealed class GetStudentProfileQueryHandler(IStudentRepository studentRepository)
    : IRequestHandler<GetStudentProfileQuery, GetStudentProfileResponse?>
{
    public async Task<GetStudentProfileResponse?> Handle(GetStudentProfileQuery request, CancellationToken cancellationToken)
    {
        var profile = await studentRepository.GetProfileAsync(request.StudentId, cancellationToken);

        if (profile is null)
            return null;

        var classroom = profile.Enrollment is not null
            ? $"{profile.Enrollment.ClassRoom.GradeLevel}{profile.Enrollment.ClassRoom.Section}"
            : null;

        return new GetStudentProfileResponse(
            profile.UserId,
            profile.User.FirstName,
            profile.User.LastName,
            profile.StudentNumber,
            classroom);
    }
}
