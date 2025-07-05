## 설계 원칙

외부에 export 해야하는 로직은 facade class에만 응집한다.
support 디렉토리에 있는 class는 상호간 참조 금지, 오직 도메인 서비스만 DI 가능하다.
그외의 class는 support class, 도메인 서비스를 마음대로 DI 가능하다. 다만, 순환 참조를 주의한다.