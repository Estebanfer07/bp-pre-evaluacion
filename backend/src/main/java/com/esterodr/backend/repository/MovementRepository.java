package com.esterodr.backend.repository;

import com.esterodr.backend.domain.Movements;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MovementRepository extends JpaRepository<Movements, UUID> {

    Optional<Movements> findByIdAndIsReversedFalse(UUID id);

    @Query("SELECT m FROM Movements m JOIN FETCH m.account a JOIN FETCH a.client c JOIN FETCH c.person p WHERE m.accountId = :accountId AND m.isReversed = false AND m.date >= :fromDate AND m.date <= :toDate ORDER BY m.createdAt DESC")
    List<Movements> findByAccountIdAndDateRangeAndIsReversedFalseWithClient(@Param("accountId") UUID accountId,
            @Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate);

    @Query("SELECT m FROM Movements m JOIN FETCH m.account a JOIN FETCH a.client c JOIN FETCH c.person p WHERE m.isReversed = false AND m.date >= :fromDate AND m.date <= :toDate ORDER BY m.createdAt DESC")
    List<Movements> findAllByDateRangeAndIsReversedFalseWithClient(@Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate);

    @Query("SELECT m FROM Movements m WHERE m.accountId = :accountId AND m.isReversed = false AND m.date >= :fromDate AND m.date <= :toDate ORDER BY m.createdAt DESC")
    List<Movements> findByAccountIdAndDateRangeAndIsReversedFalse(@Param("accountId") UUID accountId,
            @Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate);
}