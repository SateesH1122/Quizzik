using AutoMapper;
using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quizzik_Project.DTO;
using Quizzik_Project.Models;
using Microsoft.AspNetCore.Authorization;

namespace Quizzik_Project.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class QuizAttemptsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly EFCoreDbContext _context;

        public QuizAttemptsController(IMapper mapper, EFCoreDbContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        // GET: api/QuizAttempts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuizAttemptDTO>>> GetAll()
        {
            try
            {
                var quizAttempts = await _context.QuizAttempts.ToListAsync();
                var quizAttemptDTOs = _mapper.Map<List<QuizAttemptDTO>>(quizAttempts);
                return Ok(quizAttemptDTOs);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        //[Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<QuizAttemptDTO>> GetById(int id)
        {
            try
            {
                var quizAttempt = await _context.QuizAttempts.FindAsync(id);
                if (quizAttempt == null)
                {
                    return NotFound();
                }
                var quizAttemptDTO = _mapper.Map<QuizAttemptDTO>(quizAttempt);
                return Ok(quizAttemptDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<QuizAttemptDTO>> Create(QuizAttemptDTO quizAttemptDTO)
        {
            try
            {
                // Check if the user has already attempted this quiz
                var existingAttempt = await _context.QuizAttempts
                    .FirstOrDefaultAsync(qa => qa.UserID == quizAttemptDTO.UserID && qa.QuizID == quizAttemptDTO.QuizID);

                if (existingAttempt != null)
                {
                    return BadRequest("User has already attempted this quiz.");
                }

                // Map the QuizAttemptDTO to QuizAttempt entity
                var quizAttempt = _mapper.Map<QuizAttempt>(quizAttemptDTO);
                quizAttempt.AttemptDate = DateTime.Now;

                // Save the QuizAttempt to the database
                _context.QuizAttempts.Add(quizAttempt);
                await _context.SaveChangesAsync();

                // Map the saved QuizAttempt back to QuizAttemptDTO
                var createdQuizAttemptDTO = _mapper.Map<QuizAttemptDTO>(quizAttempt);

                // Return the created QuizAttemptDTO
                return CreatedAtAction(nameof(GetById), new { id = createdQuizAttemptDTO.AttemptID }, createdQuizAttemptDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        //[HttpGet("UserAttempts/{userId}")]
        //public async Task<ActionResult<IEnumerable<UserQuizAttemptDTO>>> GetUserQuizAttempts(int userId)
        //{
        //    try
        //    {
        //        var quizAttempts = await _context.QuizAttempts
        //            .Where(qa => qa.UserID == userId)
        //            .Include(qa => qa.Quiz)
        //            .ToListAsync();

        //        if (quizAttempts == null || !quizAttempts.Any())
        //        {
        //            return NotFound("No quiz attempts found for the specified user.");
        //        }

        //        var userQuizAttemptDTOs = quizAttempts.Select(qa => new UserQuizAttemptDTO
        //        {
        //            QuizTitle = qa.Quiz.Title,
        //            QuizDescription = qa.Quiz.Description,
        //            PercentageScore = (qa.Score / (double)qa.Quiz.Questions.Count) * 100
        //        }).ToList();

        //        return Ok(userQuizAttemptDTOs);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        //    }
        //}

        [HttpGet("UserAttempts/{userId}")]
        public async Task<ActionResult<IEnumerable<UserQuizAttemptDTO>>> GetUserQuizAttempts(int userId)
        {
            try
            {
                var quizAttempts = await _context.QuizAttempts
                    .Where(qa => qa.UserID == userId)
                    .Include(qa => qa.Quiz)
                    .ThenInclude(q => q.Questions) // Ensure questions are included
                    .ToListAsync();

                if (quizAttempts == null || !quizAttempts.Any())
                {
                    return NotFound( new { message ="Quiz Attempts Not Found" });
                }

                var userQuizAttemptDTOs = quizAttempts.Select(qa => new UserQuizAttemptDTO
                {
                    QuizID = qa.QuizID,
                    QuizTitle = qa.Quiz?.Title ?? "Unknown Title",
                    QuizDescription = qa.Quiz?.Description ?? "No Description",
                    PercentageScore = qa.Quiz?.Questions != null && qa.Quiz.Questions.Count > 0
                        ? (qa.Score / (double)qa.Quiz.Questions.Count) * 100
                        : 0
                }).ToList();

                return Ok(userQuizAttemptDTOs);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }



        //[Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var quizAttempt = await _context.QuizAttempts.FindAsync(id);
                if (quizAttempt == null)
                {
                    return NotFound();
                }

                _context.QuizAttempts.Remove(quizAttempt);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        [HttpGet("WithOptions/{quizId}")]
        public async Task<ActionResult<List<QuestionWithOptionsDTO>>> GetQuestionsWithOptions(int quizId)
        {
            try
            {
                var questions = await _context.Questions
                    .Where(q => q.QuizID == quizId)
                    .Include(q => q.Options)
                    .Include(q => q.Quiz)
                    .ToListAsync();

                var result = new List<QuestionWithOptionsDTO>();

                foreach (var question in questions)
                {
                    var correctOption = question.Options.FirstOrDefault(o => o.IsCorrect);
                    var questionWithOptionsDTO = new QuestionWithOptionsDTO
                    {
                        QuestionID = question.QuestionID,
                        QuestionText = question.QuestionText,
                        Options = question.Options.ToDictionary(o => o.OptionID, o => o.OptionText),
                        QuizID = question.QuizID,
                        UserID = question.Quiz.UserID,
                        QuizTitle = question.Quiz.Title,
                        QuizDescription = question.Quiz.Description,
                        DifficultyLevel = question.DifficultyLevel,
                        CorrectAnswer = correctOption?.OptionText
                    };

                    result.Add(questionWithOptionsDTO);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }



        //[Authorize(Roles = "Student")]
        [HttpPost("Submit")]
        public async Task<ActionResult<QuizAttemptDTO>> SubmitQuizAttempt(QuizAttemptSubmissionDTO submissionDTO)
        {
            try
            {
                var existingAttempt = await _context.QuizAttempts
                    .FirstOrDefaultAsync(qa => qa.UserID == submissionDTO.UserID && qa.QuizID == submissionDTO.QuizID);

                if (existingAttempt != null)
                {
                    return BadRequest("User has already attempted this quiz.");
                }

                var quiz = await _context.Quizzes
                    .Include(q => q.Questions)
                    .ThenInclude(q => q.Options)
                    .FirstOrDefaultAsync(q => q.QuizID == submissionDTO.QuizID);

                if (quiz == null)
                {
                    return NotFound("Quiz not found.");
                }

                int score = 0;

                foreach (var question in quiz.Questions)
                {
                    if (submissionDTO.Answers.TryGetValue(question.QuestionID, out int selectedOptionID))
                    {
                        var correctOption = question.Options.FirstOrDefault(o => o.IsCorrect);
                        if (correctOption != null && correctOption.OptionID == selectedOptionID)
                        {
                            score++;
                        }
                    }
                }

                var quizAttempt = new QuizAttempt
                {
                    UserID = submissionDTO.UserID,
                    QuizID = submissionDTO.QuizID,
                    Score = score,
                    AttemptDate = DateTime.Now
                };

                _context.QuizAttempts.Add(quizAttempt);
                await _context.SaveChangesAsync();

                var quizAttemptDTO = _mapper.Map<QuizAttemptDTO>(quizAttempt);

                return Ok(quizAttemptDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
