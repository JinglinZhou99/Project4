package com.example.demo;

import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Repository interface for handling game record operations.
 * Extends CrudRepository for basic CRUD operations.
 */
public interface GameRecordRepository extends CrudRepository<GameRecord, Long> {
  /**
   * Finds all game records associated with a specific userId.
   *
   * @param userId The userId to filter the game records.
   * @return A list of GameRecord objects filtered by the given userId.
   */
  List<GameRecord> findByUserId(String userId);

  /**
   * Deletes all game records associated with a specific userId.
   * Transactional annotation ensures consistency and rollback in case of failure.
   *
   * @param userId The userId for which game records will be deleted.
   */
  @Transactional
  void deleteByUserId(String userId);
}