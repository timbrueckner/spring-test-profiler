package digital.pragmatech.testing;

import digital.pragmatech.testing.reporting.TemplateHelpers;
import org.junit.jupiter.api.Test;
import org.springframework.test.context.MergedContextConfiguration;
import org.springframework.test.context.support.DelegatingSmartContextLoader;

import static org.assertj.core.api.Assertions.assertThat;

class JsonHelperTest {

  @Test
  void shouldGenerateContextStatisticsJson() {
    // Given
    ContextCacheTracker tracker = new ContextCacheTracker();
    MergedContextConfiguration config = createTestConfig();

    // Record some test data
    tracker.recordTestClassForContext(config, "com.example.TestClass");
    tracker.recordTestMethodForContext(config, "com.example.TestClass", "testMethod1");
    tracker.recordTestMethodForContext(config, "com.example.TestClass", "testMethod2");
    tracker.recordContextCreation(config, 1500L, 1024 * 1024, 8);

    // Set up the context entry with bean definitions
    tracker.recordBeanDefinitions(config, new String[] {"bean1", "bean2", "bean3"});

    // When
    TemplateHelpers.JsonHelper jsonHelper = new TemplateHelpers.JsonHelper();
    String json = jsonHelper.contextStatisticsToJson(tracker);

    // Then
    assertThat(json).isNotEmpty();
    assertThat(json).contains("contextKey");
    assertThat(json).contains("loadDuration");
    assertThat(json).contains("initialLoadTime");
    assertThat(json).contains("numberOfBeans");
    assertThat(json).contains("testClasses");
    assertThat(json).contains("testMethods");
    assertThat(json).contains("contextConfiguration");
    assertThat(json).contains("com.example.TestClass#testMethod1");
    assertThat(json).contains("com.example.TestClass#testMethod2");
    assertThat(json).contains("1500");
    assertThat(json).contains("3"); // numberOfBeans

    System.out.println("Generated JSON: " + json);
  }

  private MergedContextConfiguration createTestConfig() {
    return new MergedContextConfiguration(
        JsonHelperTest.class,
        new String[0], // locations
        new Class<?>[] {JsonHelperTest.class}, // classes
        java.util.Set.of(), // contextInitializerClasses as Set
        new String[0], // activeProfiles
        new String[0], // propertySourceLocations
        new String[0], // propertySourceProperties
        java.util.Set.of(), // contextCustomizers
        new DelegatingSmartContextLoader(),
        null, // cacheAwareContextLoaderDelegate
        null // parent
        );
  }
}
