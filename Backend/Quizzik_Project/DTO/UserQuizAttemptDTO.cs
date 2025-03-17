namespace Quizzik_Project.DTO
{
    public class UserQuizAttemptDTO
    {
        public int QuizID { get; set; }
        public string QuizTitle { get; set; }
        public string QuizDescription { get; set; }
        public double PercentageScore { get; set; }
    }
}
