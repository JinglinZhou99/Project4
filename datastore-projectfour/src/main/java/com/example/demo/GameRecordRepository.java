package com.example.demo;

import org.springframework.data.repository.CrudRepository;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface GameRecordRepository extends CrudRepository<GameRecord, Long> {
  List<GameRecord> findByUserId(String userId);

  @Transactional
  void deleteByUserId(String userId);
}