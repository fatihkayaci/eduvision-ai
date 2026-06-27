using EduVision.Application.Comman.Interfaces;
using MediatR;

namespace EduVision.Application.Features.Teacher.Queries.GetCourseAssignments;

public sealed class GetCourseAssignmentsQueryHandler(ITeacherRepository teacherRepository)
    : IRequestHandler<GetCourseAssignmentsQuery, List<GetCourseAssignmentsResponse>>
{
    public async Task<List<GetCourseAssignmentsResponse>> Handle(GetCourseAssignmentsQuery request, CancellationToken cancellationToken)
    {
        return await teacherRepository.GetCourseAssignmentsAsync(request.ClassroomCourseId, request.TermId, cancellationToken);
    }
}
