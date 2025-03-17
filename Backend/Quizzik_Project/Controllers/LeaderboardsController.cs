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
    //[Authorize] commented for backend integration checking

    [Route("api/[controller]")]
    [ApiController]
    public class LeaderboardsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly EFCoreDbContext _context;
        private readonly ILogger<LeaderboardsController> _logger;

        public LeaderboardsController(IMapper mapper, EFCoreDbContext context, ILogger<LeaderboardsController> logger)
        {
            _mapper = mapper;
            _context = context;
            _logger = logger;
        }

        // Method to get leaderboard by quiz ID
        //[HttpGet("Quiz/{quizId}")]
        //public async Task<ActionResult<IEnumerable<QuizAttemptDTO>>> GetLeaderboardByQuizId(int quizId)
        //{
        //    try
        //    {
        //        _logger.LogInformation("Getting leaderboard for quiz ID {QuizId}", quizId);

        //        var quizAttempts = await _context.QuizAttempts
        //            .Where(qa => qa.QuizID == quizId)
        //            .OrderByDescending(qa => qa.Score)
        //            .ThenBy(qa => qa.AttemptDate)
        //            .ToListAsync();

        //        var quizAttemptDTOs = _mapper.Map<List<QuizAttemptDTO>>(quizAttempts);

        //        _logger.LogInformation("Successfully retrieved leaderboard for quiz ID {QuizId}", quizId);

        //        return Ok(quizAttemptDTOs);
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "An error occurred while getting leaderboard for quiz ID {QuizId}", quizId);
        //        return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        //    }
        //}
        [HttpGet("Quiz/{quizId}")]
        public async Task<ActionResult<IEnumerable<LeaderboardEntryDTO>>> GetLeaderboardByQuizId(int quizId)
        {
            try
            {
                _logger.LogInformation("Getting leaderboard for quiz ID {QuizId}", quizId);

                var quizAttempts = await _context.QuizAttempts
                    .Include(qa => qa.User) // Ensure User is included
                    .Where(qa => qa.QuizID == quizId)
                    .OrderByDescending(qa => qa.Score)
                    .ThenBy(qa => qa.AttemptDate)
                    .ToListAsync();

                var leaderboardEntries = quizAttempts.Select(qa => new LeaderboardEntryDTO
                {
                    AttemptID = qa.AttemptID,
                    UserID = qa.UserID,
                    QuizID = qa.QuizID,
                    Score = qa.Score,
                    Username = qa.User.Username
                }).ToList();

                _logger.LogInformation("Successfully retrieved leaderboard for quiz ID {QuizId}", quizId);

                return Ok(leaderboardEntries);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while getting leaderboard for quiz ID {QuizId}", quizId);
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
