package com.example.demo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * RestController for managing game records and comments.
 */
@RestController
public class GameController {

  /**
   * Repository for game record operations.
   */
  private final GameRecordRepository gameRecordRepository;

  /**
   * Constructor to initialize repositories.
   *
   * @param gameRecordRepository Repository for game records.
   */
  public GameController(GameRecordRepository gameRecordRepository) {
    this.gameRecordRepository = gameRecordRepository;
  }

  /**
   * Endpoint to add a new game record.
   *
   * @param gameRecord The game record to add.
   * @return A success message if the record is valid, otherwise an error message.
   */
  @PostMapping("/addGameRecord")
  @CrossOrigin(origins = "*")
  public String addGameRecord(@RequestBody GameRecord gameRecord) {
    if (gameRecord == null) {
      return "The gameRecord is invalid";
    }
    this.gameRecordRepository.save(gameRecord);
    return "success";
  }

  /**
   * Endpoint to find game records by user ID.
   *
   * @param userId The user ID to search for.
   * @return A list of game records associated with the given user ID.
   */
  @GetMapping("/findByUserId")
  @CrossOrigin(origins = "*")
  public List<GameRecord> findByUserId(@RequestParam String userId) {
    return gameRecordRepository.findByUserId(userId);
  }

  /**
   * Endpoint to show all game records.
   *
   * @return A list of all game records.
   */
  @GetMapping("/showAllRecords")
  @ResponseBody
  @CrossOrigin(origins = "*")
  public List<GameRecord> showAllRecords() {
    Iterable<GameRecord> gameRecords = this.gameRecordRepository.findAll();
    List<GameRecord> recordList = new ArrayList<>();
    gameRecords.forEach(recordList::add);
    return recordList;
  }

  /**
   * Endpoint to delete game records by user ID.
   *
   * @param userId The user ID for which the records need to be deleted.
   * @return A message indicating successful deletion.
   */
  @DeleteMapping("/deleteByUserId")
  @CrossOrigin(origins = "*")
  public String deleteByUserId(@RequestParam String userId) {
    gameRecordRepository.deleteByUserId(userId);
    return "Deleted records for userId: " + userId;
  }

  /**
   * Endpoint to check if a handle is already in use by another user.
   *
   * @param handle The handle to check.
   * @param userId The user ID to exclude from the check.
   * @return A ResponseEntity indicating whether the handle is in use (true) or not (false).
   */
  @GetMapping("/checkHandle")
  @CrossOrigin(origins = "*")
  public ResponseEntity<Boolean> checkHandle(@RequestParam String handle, @RequestParam String userId) {
    Iterable<GameRecord> allRecords = gameRecordRepository.findAll();
    for (GameRecord record : allRecords) {
      if (handle.equals(record.getHandle()) && !userId.equals(record.getUserId())) {
        return ResponseEntity.ok(true); // Handle is in use by another user
      }
    }
    return ResponseEntity.ok(false); // Handle is not in use
  }

  /**
   * Endpoint to update a user's handle based on user ID.
   *
   * @param userId The user ID for which the handle needs to be updated.
   * @param newHandle The new handle to set for the user.
   * @return A message indicating successful update or failure if no records found.
   */
  @PutMapping("/updateHandleByUserId")
  @CrossOrigin(origins = "*")
  public String updateHandleByUserId(@RequestParam String userId, @RequestParam String newHandle) {
    List<GameRecord> recordsToUpdate = gameRecordRepository.findByUserId(userId);

    if (recordsToUpdate.isEmpty()) {
      return "No records found for userId: " + userId;
    }

    for (GameRecord record : recordsToUpdate) {
      record.setHandle(newHandle); // Assuming GameRecord has a setHandle method
    }

    gameRecordRepository.saveAll(recordsToUpdate);
    return "Updated handle for userId: " + userId;
  }

}