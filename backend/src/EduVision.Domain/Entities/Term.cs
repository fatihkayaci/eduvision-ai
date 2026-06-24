using EduVision.Domain.Exceptions;

namespace EduVision.Domain.Entities;

public sealed class Term : BaseEntity
{
    public Guid SchoolId { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public int Year { get; private set; }

    public DateOnly StartDate { get; private set; }

    public DateOnly EndDate { get; private set; }

    public School School { get; private set; } = null!;

    private Term()
    {
    }

    public static Term Create(Guid schoolId, string name, int year, DateOnly startDate, DateOnly endDate)
    {
        if (schoolId == Guid.Empty) throw new DomainValidationException("School ID cannot be empty.");
        if (string.IsNullOrWhiteSpace(name)) throw new DomainValidationException("Term name cannot be empty.");
        if (year < 2000) throw new DomainValidationException("Year is invalid.");
        if (endDate <= startDate) throw new DomainValidationException("End date must be after start date.");

        return new Term
        {
            SchoolId = schoolId,
            Name = name.Trim(),
            Year = year,
            StartDate = startDate,
            EndDate = endDate
        };
    }
}
