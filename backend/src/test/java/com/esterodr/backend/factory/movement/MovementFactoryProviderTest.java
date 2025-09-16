package com.esterodr.backend.factory.movement;

import com.esterodr.backend.domain.enums.MovementType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MovementFactoryProviderTest {

    @Mock
    private MovementFactory depositFactory;

    @Mock
    private MovementFactory withdrawalFactory;

    @Mock
    private MovementFactory transferFactory;

    private MovementFactoryProvider movementFactoryProvider;

    private static final MovementType TEST_DEPOSIT_TYPE = MovementType.DEPOSIT;
    private static final MovementType TEST_WITHDRAWAL_TYPE = MovementType.WITHDRAWAL;
    private static final MovementType TEST_TRANSFER_TYPE = MovementType.TRANSFER;

    @BeforeEach
    void setUp() {
        when(depositFactory.getMovementType()).thenReturn(TEST_DEPOSIT_TYPE);
        when(withdrawalFactory.getMovementType()).thenReturn(TEST_WITHDRAWAL_TYPE);
        when(transferFactory.getMovementType()).thenReturn(TEST_TRANSFER_TYPE);

        List<MovementFactory> factories = Arrays.asList(depositFactory, withdrawalFactory, transferFactory);
        movementFactoryProvider = new MovementFactoryProvider(factories);
    }

    @Test
    void getFactory_WithValidTypes_ShouldReturnCorrectFactory() {
        assertEquals(depositFactory, movementFactoryProvider.getFactory(TEST_DEPOSIT_TYPE));
        assertEquals(withdrawalFactory, movementFactoryProvider.getFactory(TEST_WITHDRAWAL_TYPE));
        assertEquals(transferFactory, movementFactoryProvider.getFactory(TEST_TRANSFER_TYPE));
    }

    @Test
    void getFactory_WithUnsupportedType_ShouldThrowException() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> movementFactoryProvider.getFactory(null));

        assertEquals("Unsupported movement type: null", exception.getMessage());
    }
}