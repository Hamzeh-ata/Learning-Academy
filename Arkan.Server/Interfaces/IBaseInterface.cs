namespace Arkan.Server.Interfaces
{
    public interface IBaseInterface<TEntity>
    {
        Task<IEnumerable<TEntity>> GetAll();
        bool Update(TEntity entity);
        bool Remove(TEntity entity);
        bool Save();
        Task<TEntity> GetByIdAsync(int id);
    }
}
