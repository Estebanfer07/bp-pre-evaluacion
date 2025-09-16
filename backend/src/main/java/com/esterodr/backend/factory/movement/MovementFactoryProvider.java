package com.esterodr.backend.factory.movement;

import com.esterodr.backend.domain.enums.MovementType;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class MovementFactoryProvider {

    private final Map<MovementType, MovementFactory> factoryMap;

    public MovementFactoryProvider(List<MovementFactory> factories) {
        this.factoryMap = factories.stream()
                .collect(Collectors.toMap(
                        MovementFactory::getMovementType,
                        Function.identity()));
    }

    public MovementFactory getFactory(MovementType movementType) {
        MovementFactory factory = factoryMap.get(movementType);
        if (factory == null) {
            throw new IllegalArgumentException("Unsupported movement type: " + movementType);
        }
        return factory;
    }
}