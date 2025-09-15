package com.esterodr.backend.util;

import java.beans.PropertyDescriptor;

import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;

public class BeanUtils {
    public static void copyNonNullProperties(Object src, Object target) {
        final BeanWrapper srcWrap = new BeanWrapperImpl(src);
        PropertyDescriptor[] propertyDescriptors = srcWrap.getPropertyDescriptors();

        BeanWrapper targetWrap = new BeanWrapperImpl(target);
        for (PropertyDescriptor property : propertyDescriptors) {
            Object srcValue = srcWrap.getPropertyValue(property.getName());
            if (srcValue != null && targetWrap.isWritableProperty(property.getName())) {
                targetWrap.setPropertyValue(property.getName(), srcValue);
            }
        }
    }
}
