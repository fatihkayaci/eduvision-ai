using EduVision.Application.Comman.Interfaces;
using MediatR;

namespace EduVision.Application.Features.Student.Queries.GetStudentAssignments;

public sealed class GetStudentAssignmentsQueryHandler(IStudentRepository studentRepository)
    : IRequestHandler<GetStudentAssignmentsQuery, List<GetStudentAssignmentsResponse>>
{
    public async Task<List<GetStudentAssignmentsResponse>> Handle(GetStudentAssignmentsQuery request, CancellationToken cancellationToken)
    {
        var assignments = await studentRepository.GetAssignmentsAsync(request.StudentId, cancellationToken);

        return assignments
            .Select(a => new GetStudentAssignmentsResponse(
                a.Id,
                a.Title,
                a.Description,
                a.Type.ToString(),
                a.FileUrl,
                a.StartDate,
                a.DueDate))
            .ToList();
    }
}
